import { MongoClient as ClientMongo, ServerApiVersion as VersionApiServeur } from "mongodb";

const uriBase = process.env.ATLAS_URI || "";
const connexion = new ClientMongo(uriBase, {
  serverApi: {
    version: VersionApiServeur.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await connexion.connect();
  await connexion.db("admin").command({ ping: 1 });
  console.log(
    "Ping réussi. Connexion établie avec succès à la base de données Atlas !"
  );
} catch(erreur) {
  console.error(erreur);
}

let baseDeDonnees = connexion.db("Appareils");

export default baseDeDonnees;
