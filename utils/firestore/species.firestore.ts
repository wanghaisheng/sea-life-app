import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";
import { ITaxa, ITaxaResponse } from "../../types/INaturalist/TaxaResponse";
import { ISpecies } from "../../types/Species";
import { IContributionForm } from "../../types/Contribution";

const collectionName = "species";

export const getSpecies = (id: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${id}`));
  return document.then((doc) => doc.data()) as Promise<ISpecies>;
};

export const getAllSpecies = async (
  scientificName?: string
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (scientificName) {
    queryConstraints.push(
      where("taxonomy_ids", "array-contains", scientificName)
    );
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};

export const getAllSpeciesByGroupList = async (
  taxaId: string[]
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (taxaId) {
    queryConstraints.push(where("taxonomy_ids", "array-contains-any", taxaId));
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};

export const saveContribution = async (suggestionForm: IContributionForm) => {
  const speciesRef = doc(
    firestore,
    `${collectionName}/${suggestionForm.speciesId}`
  );
  const suggestedUpdateCollectionRef = collection(
    speciesRef,
    "contributions"
  );

  return addDoc(suggestedUpdateCollectionRef, {
    status: "pending",
    species: speciesRef,
    user: doc(firestore, `users/${suggestionForm.userId}`),
    timestamp: Timestamp.fromDate(new Date()),
    field: suggestionForm.field,
    newValue: suggestionForm.newValue,
    comment: suggestionForm.comment,
  });
};

// Get all suggested updates for a species

// firebase.firestore().collection("species")
//   .doc(speciesId)
//   .collection("suggestedUpdates")
//   .get()
//   .then((snapshot) => {
//     snapshot.forEach((suggestion) => {
//       console.log("Suggested update:", suggestion.data());
//     });
//   });

// Get the species information along with the number of pending suggested updates

// const speciesId = "species1";
// firebase.firestore().collection("species").doc(speciesId).get().then((species) => {
//   firebase.firestore().collection("species")
//     .doc(speciesId)
//     .collection("suggestedUpdates")
//     .where("status", "==", "pending")
//     .get()
//     .then((suggestionsSnapshot) => {
//       console.log("Species information:", species.data());
//       console.log("Number of pending suggestions:", suggestionsSnapshot.size);
//     });
// });
