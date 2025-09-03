// import type { User } from "@supabase/supabase-js";
// import {  createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../supabase-client";

// interface AuthContextType {
//   user: User | null;
//   signInWithGithub: () => void;
//   signOut: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//    useEffect(() =>{
//     supabase.auth.getSession().then(({data:{session}}) => {
//         setUser(session?.user ?? null);
//         // console.log(user)
//     })
//    }, [])


//   const signInWithGithub = () => {
    
//       supabase.auth.signInWithOAuth({provider: "github",});
    
//   };
//   const signOut = () => {};

//   return (
//     <AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
//         {""}
//       {children}
//         {""}
//     </AuthContext.Provider>
//   );
// };

//  created hook for user authentication nighter calling useContext()

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within the AuthProvider");
//   }
//   return context;
// };

import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGithub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Mojooda session hasil karein
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // console.log(user)
    });

    // Auth state mein tabdeeli ko sunein
    //   chatgpt ka treeka
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup function
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
     //   chatgpt ka treeka ^
  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};