import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, child, ref, get, set } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { conf } from '../../config.js';

class DatabaseService {
  app: FirebaseApp
  db: Database

  constructor() {
    try {
      this.app = initializeApp({
        ...conf.firebase
      })

      const auth = getAuth();
      signInWithEmailAndPassword(auth, conf.authFirebase.email, conf.authFirebase.password)
        .catch((error) => {
          console.log(error)
        })

      this.db = getDatabase(this.app);

    } catch (err) {
      console.error('Application works without database!!');
      console.error(err);
    }
  }

  create(recipt: Recipt): Promise<void> {
    return new Promise((resolve, reject) => {
      set(ref(this.db, 'recipts/' + recipt.id), {
        ...recipt
      }).then(resolve, reject).catch(reject)
    })
  }

  getRecipts(): Promise<Collection<Recipt>>{
    return new Promise((resolve, reject) => {
      get(child(ref(this.db), 'recipts')).then((snapshot) => {
        if(snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          reject()
        }
      })
    });
  }

  getRecipt(id: string): Promise<Recipt> {
    return new Promise((resolve, reject) => {
      get(child(ref(this.db), `recipts/${id}`)).then((snapshot) => {
        if(snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          reject()
        }
      }).catch(reject)
    })
  }
}

const db = new DatabaseService();
export default db;

export interface Collection<T> {
  [key: string]: T
}

export interface Recipt {
  title: string,
  ingredints: string[],
  coocking_steps: string[],
  id: string,
  imageUrl: string
}


