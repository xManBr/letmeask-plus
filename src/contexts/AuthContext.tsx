import firebase from "firebase";
import { ReactNode, createContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";

export const AuthContext = createContext({} as AuthContexType);

type User = {
  id: string,
  name: string,
  avatar: string
}
type AuthContexType = {
  user: User | undefined,
  singInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children : ReactNode
}

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<User>();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Acount.');
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })
    return () =>
      unsubscribe();
  }, []
  )

  async function singInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        throw new Error('Informações da conta Google foram perdidas.');
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, singInWithGoogle }}>
    {props.children}
  </AuthContext.Provider>
  )

}