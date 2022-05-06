import TestData from "./TestData";
import { v4 as uuid } from "uuid";

export function getUserRepository(userDb) {
  return {
    find: jest.fn(() => userDb),
    findOne: jest.fn((criteria) => {
      let id, email;
      console.log("Mocking find one :: ", criteria);
      if (criteria && typeof criteria === "string") {
        id = criteria;
        return userDb.find((_user) => _user.id === id);
      } else if (criteria && typeof criteria === "object" && criteria.where.email) {
        email = criteria.where.email;
        return userDb.find((_user) => _user.email === email);
      }
    }),
    delete: jest.fn((id) => {
      console.log("Mocking delete one :: ", id);
      userDb = userDb.filter((_user) => _user.id !== id);
    }),
    save: jest.fn((_user) => {
      console.log("Mocking save :: ", _user);
      _user.id = _user.id ? _user.id : uuid();
      userDb.push(_user);
    })
  };

};
