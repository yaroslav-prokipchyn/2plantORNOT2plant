package com.naveanalytics.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("/users")
@AllArgsConstructor
@Tag(name = "User API")
public class UserController {

    private final UserService userService;

    @GetMapping("/current")
    @Operation(summary = "Get the current logged user details")
    public User getUser() {
        return userService.getCurrentUser();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return userService.getUser(id);
    }

    @GetMapping()
    public List<User> getUsers(@RequestParam User.Role role, @RequestParam(required = false) Boolean active) {
        return active == null
                ? userService.getUsersByRole(role)
                : userService.getUsersByRoleAndStatus(role, active);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user details", description = "Update user details by id, can be used to reassign user to a different organization. or change user role.")
    public User updateUser(@PathVariable int id, @RequestBody UserRequest user) {
        return userService.updateUser(id, user);
    }

    @PostMapping()
    public User createUser(@RequestBody UserRequest user) {
        return userService.createUser(user);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete user by id, Also delete user in cognito, will reassign all deleted user fields to current user if he is admin otherwise unassign fields.")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update user status", description = "Update user status by id, can be used to activate or deactivate user. Also change user status in cognito.")
    public User updateUserStatus(@PathVariable int id, @RequestParam boolean active) {
        return userService.updateUserStatus(id, active);
    }

}
