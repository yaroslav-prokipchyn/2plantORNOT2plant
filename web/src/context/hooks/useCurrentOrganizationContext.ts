import { useContext } from 'react';
import { CurrentOrganizationContext } from 'src/context/CurrentOrganizationContext.tsx';

export const useCurrentOrganization = () => {
  const context = useContext(CurrentOrganizationContext);

  if (!context) {
    throw new Error('useCurrentUserContext must be used within a CurrentUserProvider');
  }

  return {
    isOrganizationLoading: context.isLoading,
    currentOrganization: context.currentOrganization,
    isCurrentOrganizationLocked: context.isCurrentOrganizationLocked,
    lockCurrentOrganization: context.lockCurrentOrganization,
    lockedAt: context.lockedAt,
    allFieldAreValid: context.allFieldAreValid,
    checkIfAllFieldAreValid: context.checkIfAllFieldAreValid,
   };
};
