import { createContext, FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import usersAPI from 'src/api/usersAPI.ts';
import { Organization, OrganizationWithAdmins } from 'src/types/Organizations.ts';
import organizationAPI from 'src/api/organizarionsApi.ts';

type CurrentOrganizationContextProps = {
  isLoading: boolean
  currentOrganization: OrganizationWithAdmins,
  isCurrentOrganizationLocked: boolean
  lockCurrentOrganization: () => Promise<Organization | false>,
  allFieldAreValid: boolean,
  checkIfAllFieldAreValid: () => void
  lockedAt: string
}
export const CurrentOrganizationContext = createContext<CurrentOrganizationContextProps>({
  isLoading: false,
  currentOrganization: undefined!,
  lockedAt: undefined!,
  isCurrentOrganizationLocked: undefined!,
  lockCurrentOrganization: () => new Promise(() => {}),
  allFieldAreValid: false,
  checkIfAllFieldAreValid: () => {}
})
const CurrentOrganizationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithAdmins>(undefined!);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCurrentOrganizationLocked, setIsCurrentOrganizationLocked] = useState<boolean>(undefined!);
  const [currentOrganizationLockedAt, setCurrentOrganizationLockedAt] = useState<string>(undefined!);
  const [allFieldAreValid, setAllFieldAreValid] = useState<boolean>(false);

  const checkIfAllFieldAreValid = useCallback(() => {
    if (currentOrganization?.id !== undefined) {
      setIsLoading(true)
      organizationAPI.checkIfAllFieldAreValid(currentOrganization.id).then((validationErrors) => {
        setAllFieldAreValid(Object.keys(validationErrors).length === 0)
        setIsLoading(false)
      })
    }
  }, [currentOrganization?.id, setAllFieldAreValid]);


  const getOrganization =async () => {
    setIsLoading(true)
    const user = await usersAPI.getCurrent()
    if (!user.organizationId) return

    const organization = await organizationAPI.getById(user.organizationId)
    setCurrentOrganization(organization)
    setIsCurrentOrganizationLocked(organization.locked)
    setCurrentOrganizationLockedAt(organization.lockedAt)
    setIsLoading(false)
  }

  useEffect(() => {
    getOrganization();
  }, []);

  useEffect(() => {
    checkIfAllFieldAreValid()
  }, [checkIfAllFieldAreValid]);

  const lockCurrentOrganization = async () => {
    if (!currentOrganization) return false

    setIsLoading(true)
    const organization = await organizationAPI.lock(currentOrganization.id)
      .catch(() => setIsLoading(false))

    if (!organization) return false;
    await getOrganization()

    setIsLoading(false)
    return organization
  }

  return (
    <CurrentOrganizationContext.Provider
      value={{ isLoading, currentOrganization, isCurrentOrganizationLocked, lockCurrentOrganization, allFieldAreValid, checkIfAllFieldAreValid, lockedAt: currentOrganizationLockedAt }}>
      {children}
    </CurrentOrganizationContext.Provider>
  );
};

export default CurrentOrganizationProvider;
