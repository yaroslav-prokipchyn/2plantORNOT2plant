import { useContext } from 'react';
import { CurrentUserContext } from 'src/context/CurrentUserContext.tsx';
import { Roles, User } from 'src/types/Users.ts';
import { useCookies } from "react-cookie";

const isSuperAdmin = (currentUser: User) => currentUser.roles.includes(Roles.SUPER_ADMIN)
const isAdmin = (currentUser: User) => currentUser.roles.includes(Roles.ADMIN)
const isAgronomist = (currentUser: User) => currentUser.roles.includes(Roles.AGRONOMIST)

export const useCurrentUser = () => {
  const userContext = useContext(CurrentUserContext);

  const [cookies]  = useCookies(['role']);
  if (!userContext) {
    throw new Error('useCurrentUserContext must be used within a CurrentUserProvider');
  }

  const user = userContext.currentUser;

  return {
    user,
    isSuperAdmin: user ? isSuperAdmin(user) : false,
    isAdmin: user ? (isAdmin(user) && (cookies.role === 'admin' || !cookies.role)) : false,
    isAgronomist: user ? ( isAgronomist(user) || (isAdmin(user) && cookies.role === 'agronomist')) : false,
    isShowRoleSwitcher: user ? isAdmin(user) : false,
   };
};
