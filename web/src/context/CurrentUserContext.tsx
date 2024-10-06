import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react';
import usersAPI from 'src/api/usersAPI.ts';
import { User } from 'src/types/Users.ts';

type CurrentUserContextProps = {
  currentUser?: User
}
export const CurrentUserContext = createContext<CurrentUserContextProps>({
  currentUser: undefined!
})
const CurrentUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const user = await usersAPI.getCurrent()
      setCurrentUser(user)
    })()
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
