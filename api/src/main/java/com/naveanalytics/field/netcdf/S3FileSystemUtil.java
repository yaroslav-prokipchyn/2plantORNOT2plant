package com.naveanalytics.field.netcdf;

import com.amazonaws.services.identitymanagement.AmazonIdentityManagementClientBuilder;
import com.amazonaws.services.identitymanagement.model.AmazonIdentityManagementException;
import com.amazonaws.services.identitymanagement.model.AttachRolePolicyRequest;
import com.amazonaws.services.identitymanagement.model.AttachedPolicy;
import com.amazonaws.services.identitymanagement.model.CreatePolicyRequest;
import com.amazonaws.services.identitymanagement.model.CreateRoleRequest;
import com.amazonaws.services.identitymanagement.model.DeletePolicyRequest;
import com.amazonaws.services.identitymanagement.model.DeleteRoleRequest;
import com.amazonaws.services.identitymanagement.model.DetachRolePolicyRequest;
import com.amazonaws.services.identitymanagement.model.GetRoleRequest;
import com.amazonaws.services.identitymanagement.model.ListAttachedRolePoliciesRequest;
import com.amazonaws.services.identitymanagement.model.ListAttachedRolePoliciesResult;
import com.amazonaws.services.identitymanagement.model.NoSuchEntityException;
import com.amazonaws.services.identitymanagement.model.TagRoleRequest;
import com.naveanalytics.ApplicationProperties;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CommonPrefix;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.GetBucketTaggingRequest;
import software.amazon.awssdk.services.s3.model.GetBucketTaggingResponse;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutBucketTaggingRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.model.Tag;
import software.amazon.awssdk.services.s3.model.Tagging;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import static com.naveanalytics.field.netcdf.AWSTagsUtil.convertToValidAWSTag;

@Service
@AllArgsConstructor
@Log4j2
public class S3FileSystemUtil implements FileSystemUtil {

    private ApplicationProperties applicationProperties;

    @Override
    public List<String> listObjects(String bucket, String key) {
        try (S3Client s3Client = S3Client.create()) {

            ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                    .bucket(bucket)
                    .prefix(key)
                    .build();

            return s3Client.listObjectsV2(listObjectsV2Request).contents().stream().map(S3Object::key).toList();
        }
    }

    @Override
    public List<String> listSubFolder(String bucket, String key) {
        try (S3Client s3Client = S3Client.create()) {

            ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                    .bucket(bucket)
                    .prefix(key)
                    .delimiter("/")
                    .build();

            return s3Client.listObjectsV2(listObjectsV2Request).commonPrefixes().stream()
                    .map(CommonPrefix::prefix)
                    .map(commonPrefix -> commonPrefix.substring(key.length(), commonPrefix.length() - 1))
                    .toList();
        }
    }

    @Override
    public void createBucket(String id, String organizationName, String organizationId, String clientId) {
        try (S3Client s3Client = S3Client.create()) {
            boolean bucketExists;

            // Check if bucket exists
            try {
                s3Client.headBucket(HeadBucketRequest.builder().bucket(id).build());
                bucketExists = true;
                log.info("Bucket {} already exists", id);
            } catch (NoSuchBucketException e) {
                bucketExists = false;
            }

            if (!bucketExists) {
                s3Client.createBucket(b -> b.bucket(id));
                log.info("Created bucket {}", id);
            }

            // Create new tags
            var organizationNameTag = Tag.builder().key("organizationName").value(convertToValidAWSTag(organizationName)).build();
            var environmentTag = Tag.builder().key("environment").value(convertToValidAWSTag(applicationProperties.getEnvironment())).build();
            var organizationIdTag = Tag.builder().key("organizationId").value(convertToValidAWSTag(organizationId)).build();
            var clientIdTag = Tag.builder().key("clientId").value(convertToValidAWSTag(clientId)).build();
            List<Tag> newTags = Arrays.asList(organizationNameTag, environmentTag, organizationIdTag, clientIdTag);

            // Retrieve existing tags if bucket exists
            List<Tag> existingTags = new ArrayList<>();
            if (bucketExists) {
                try {
                    GetBucketTaggingResponse taggingResponse = s3Client.getBucketTagging(GetBucketTaggingRequest.builder().bucket(id).build());
                    existingTags = taggingResponse.tagSet();
                } catch (S3Exception e) {
                    if (!e.awsErrorDetails().errorCode().equals("NoSuchTagSet")) {
                        throw e;
                    }
                }
            }

            Set<Tag> tagsSet = new TreeSet<>(Comparator.comparing(Tag::key));
            tagsSet.addAll(existingTags);
            tagsSet.addAll(newTags);
            List<Tag> mergedTags = new ArrayList<>(tagsSet);

            s3Client.putBucketTagging(PutBucketTaggingRequest.builder()
                    .bucket(id)
                    .tagging(Tagging.builder().tagSet(mergedTags).build())
                    .build());

            createRole(clientId, id, organizationName);
        }
    }

    @Override
    public void deleteBucketAndRoleAndPolicy(String organizationName, String clientId, Boolean deleteBucket) {
        String roleName = "nave_s3_access_for_" + clientId;
        String policyName = "ClientAppPolicy-" + clientId;

        var iamClient = AmazonIdentityManagementClientBuilder.standard().build();

        try {
            iamClient.detachRolePolicy(new DetachRolePolicyRequest().withRoleName(roleName).withPolicyArn("arn:aws:iam::%s:policy/%s".formatted(applicationProperties.getAccountId(),  policyName)));
            log.info("Detached policy {} from role {}", policyName, roleName);
        } catch (AmazonIdentityManagementException e) {
            log.warn("Failed to detach {} from {}", policyName, roleName, e);
        }

        try {
            iamClient.deletePolicy(new DeletePolicyRequest().withPolicyArn("arn:aws:iam::%s:policy/%s" .formatted(applicationProperties.getAccountId(), policyName)));
            log.info("Deleted policy {}", policyName);
        } catch (AmazonIdentityManagementException e) {
            log.warn("Can not delete policy {}", policyName, e);
        }

        try {
            iamClient.deleteRole(new DeleteRoleRequest().withRoleName(roleName));
            log.info("Deleted role {}", roleName);
        } catch (AmazonIdentityManagementException e) {
            log.warn("Can not delete role {}", roleName, e);
        }

        if (deleteBucket != null && deleteBucket) {
            try (S3Client s3Client = S3Client.create()) {
                deleteAllObjects(s3Client, organizationName);

                s3Client.deleteBucket(b -> b.bucket(organizationName));
                log.info("Deleted bucket {}", organizationName);
            }
        }
    }

    private static void deleteAllObjects(S3Client s3, String bucketName) {
        ListObjectsV2Request listObjectsReq = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listObjResponse;
        do {
            listObjResponse = s3.listObjectsV2(listObjectsReq);
            if (listObjResponse.hasContents()) {
                var objectsToDelete = listObjResponse.contents().stream()
                        .map(s3Object -> ObjectIdentifier.builder().key(s3Object.key()).build()).toList();

                if (!objectsToDelete.isEmpty()) {
                    var deleteObjectsRequest = DeleteObjectsRequest.builder()
                            .bucket(bucketName)
                            .delete(Delete.builder().objects(objectsToDelete).build())
                            .build();
                    s3.deleteObjects(deleteObjectsRequest);
                }
            }
            listObjectsReq = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .continuationToken(listObjResponse.nextContinuationToken())
                    .build();
        } while (listObjResponse.isTruncated());
    }


    @SneakyThrows
    private void createRole(String clientId, String bucketName, String organizationName) {
        String roleName = "nave_s3_access_for_" + clientId;
        String policyName = "ClientAppPolicy-" + clientId;

        var iamClient = AmazonIdentityManagementClientBuilder.standard().build();

        GetRoleRequest getRoleRequest = new GetRoleRequest().withRoleName(roleName);
        boolean roleExists = true;
        try {
            iamClient.getRole(getRoleRequest);
            log.info("Role {} already exists", roleName);
        } catch (NoSuchEntityException e) {
            roleExists = false;
        }

        if (!roleExists) {
            var createRoleRequest = new CreateRoleRequest()
                    .withRoleName(roleName)
                    .withAssumeRolePolicyDocument("""
                              {
                                "Version": "2012-10-17",
                                "Statement": [
                                  {
                                    "Effect": "Allow",
                                    "Principal": {
                                        "AWS": "arn:aws:iam::%s:role/%s-nave-viz-python-task-role"
                                    },
                                    "Action": "sts:AssumeRole"
                                  }
                                ]
                              }""".formatted(applicationProperties.getAccountId(), applicationProperties.getEnvironment()));
            iamClient.createRole(createRoleRequest);
            iamClient.tagRole(new TagRoleRequest()
                    .withRoleName(roleName)
                    .withTags(
                            new com.amazonaws.services.identitymanagement.model.Tag().withKey("clientId").withValue(clientId),
                            new com.amazonaws.services.identitymanagement.model.Tag().withKey("organizationId").withValue(bucketName),
                            new com.amazonaws.services.identitymanagement.model.Tag().withKey("organizationName").withValue(organizationName)
                    )
            );
            log.info("Created role {}", roleName);
        }

        // Check attached policies to the role
        boolean policyExists = false;
        try {
            ListAttachedRolePoliciesRequest listAttachedRolePoliciesRequest = new ListAttachedRolePoliciesRequest().withRoleName(roleName);
            ListAttachedRolePoliciesResult listAttachedRolePoliciesResult = iamClient.listAttachedRolePolicies(listAttachedRolePoliciesRequest);
            for (AttachedPolicy attachedPolicy : listAttachedRolePoliciesResult.getAttachedPolicies()) {
                if (attachedPolicy.getPolicyName().equals(policyName)) {
                    policyExists = true;
                    log.info("Policy {} already attached to role {}", policyName, roleName);
                    break;
                }
            }
        } catch (AmazonIdentityManagementException e) {
            policyExists = false;
        }

        if (!policyExists) {
            var policyDocument = """
                    {
                      "Version": "2012-10-17",
                      "Statement": [
                        {
                          "Effect": "Allow",
                          "Action": "s3:*",
                          "Resource": [
                            "arn:aws:s3:::%s",
                            "arn:aws:s3:::%s/*"
                          ]
                        }
                      ]
                    }""".formatted(bucketName, bucketName, clientId);

            var createPolicyRequest = new CreatePolicyRequest()
                    .withPolicyName(policyName)
                    .withPolicyDocument(policyDocument);

            var policyResult = iamClient.createPolicy(createPolicyRequest);

            iamClient.tagPolicy(
                    new com.amazonaws.services.identitymanagement.model.TagPolicyRequest()
                            .withPolicyArn(policyResult.getPolicy().getArn())
                            .withTags(
                                    new com.amazonaws.services.identitymanagement.model.Tag().withKey("clientId").withValue(clientId),
                                    new com.amazonaws.services.identitymanagement.model.Tag().withKey("organizationId").withValue(bucketName),
                                    new com.amazonaws.services.identitymanagement.model.Tag().withKey("organizationName").withValue(organizationName)
                            ));
            log.info("Created policy {}", policyName);
            var attachPolicyRequest = new AttachRolePolicyRequest()
                    .withRoleName(roleName)
                    .withPolicyArn(policyResult.getPolicy().getArn());
            iamClient.attachRolePolicy(attachPolicyRequest);
            log.info("Attached policy {} to role {}", policyName, roleName);
        }

    }


}
