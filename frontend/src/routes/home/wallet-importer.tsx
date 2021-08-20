import React from "react";
import {ImportWallet} from "../../api/service";
import {FormGroup} from "../../components/form-group";
import {useForm} from "react-hook-form";
import {AppToaster} from "../../components/toaster";
import {Colors} from "../../config/colors";
import {ImportWalletRequest} from "../../models/import-wallet";

interface FormFields {
  rootPath: string;
  name: string;
  passphrase: string;
  mnemonic: string;
}

export interface WalletImporterProps {
  request: ImportWalletRequest;
}

export const WalletImporter = ({request}: WalletImporterProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormFields>({
    defaultValues: {
      rootPath: request.RootPath,
      name: request.Name,
      passphrase: request.Passphrase,
      mnemonic: request.Mnemonic,
    },
  });

  const onSubmit = async (values: FormFields) => {
    try {
      const success = await ImportWallet({
        RootPath: values.rootPath,
        Name: values.name,
        Passphrase: values.passphrase,
        Mnemonic: values.mnemonic,
      });
      if (success) {
        AppToaster.show({
          message: "Wallet imported!",
          color: Colors.GREEN,
        });
      } else {
        AppToaster.show({message: "Error: Unknown", color: Colors.RED});
      }
    } catch (err) {
      AppToaster.show({message: `Error: ${err}`, color: Colors.RED});
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label="Root path"
        labelFor="rootPath"
        errorText={errors.rootPath?.message}
      >
        <input
          type="text"
          {...register("rootPath")}
        />
      </FormGroup>
      <FormGroup
        label="Name"
        labelFor="name"
        errorText={errors.name?.message}
      >
        <input
          type="text"
          {...register("name", {required: "Required"})}
        />
      </FormGroup>
      <FormGroup
        label="Mnemonic"
        labelFor="mnemonic"
        errorText={errors.mnemonic?.message}
      >
        <input
          type="text"
          {...register("mnemonic", {required: "Required"})}
        />
      </FormGroup>
      <FormGroup
        label="Passphrase"
        labelFor="passphrase"
        errorText={errors.passphrase?.message}
      >
        <input
          type="text"
          {...register("passphrase", {required: "Required"})}
        />
      </FormGroup>
      <button type="submit">Submit</button>
    </form>
  );
};
