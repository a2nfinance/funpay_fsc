import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";

import { AppState } from "../store";
export const saveAddressThunk = createAsyncThunk("addressBook/save-address", async (_, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   try {
      // save DB
      let address = state.addressBook.address;
      fetch(`/api/db/address/save`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({...address, owner: state.network.account})
      });
      successToastContent(
          `Create new address success`,
          ``,
      )
      return true;
  } catch (e) {
      errorToastContent(e);
      return false;
  }
})