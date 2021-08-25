import React from "react";
import { ImportWallet } from "../../api/service";
import { FormGroup } from "../../components/form-group";
import { useForm } from "react-hook-form";
import { AppToaster } from "../../components/toaster";
import { Colors } from "../../config/colors";
import { ImportWalletRequest } from "../../models/import-wallet";
import { ImportSuccess } from "./import-success";

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

interface FormFields {
  rootPath: string;
  name: string;
  passphrase: string;
  mnemonic: string;
}

export interface ImportMnemonicProps {
  request: ImportWalletRequest;
}

export const ImportMnemonic = ({ request }: ImportMnemonicProps) => {
  const [formState, setFormState] = React.useState(FormState.Default);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      rootPath: request.RootPath,
      name: request.Name,
      passphrase: request.Passphrase,
      mnemonic: request.Mnemonic,
    },
  });

  const onSubmit = async (values: FormFields) => {
    setFormState(FormState.Pending);
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
        setFormState(FormState.Success);
      } else {
        AppToaster.show({ message: "Error: Unknown", color: Colors.RED });
        setFormState(FormState.Failure);
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED });
      setFormState(FormState.Failure);
    }
  };

  return formState === FormState.Success ? (
    <ImportSuccess />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label="Wallet location"
        labelFor="rootPath"
        errorText={errors.rootPath?.message}
      >
        <input type="text" {...register("rootPath")} />
      </FormGroup>
      <FormGroup
        label="* Name"
        labelFor="name"
        errorText={errors.name?.message}
      >
        <input type="text" {...register("name", { required: "Required" })} />
      </FormGroup>
      <FormGroup
        label="* Mnemonic"
        labelFor="mnemonic"
        errorText={errors.mnemonic?.message}
      >
        <textarea
          {...register("mnemonic", { required: "Required" })}
          style={{ minHeight: 75 }}
        />
      </FormGroup>
      <FormGroup
        label="* Passphrase"
        labelFor="passphrase"
        errorText={errors.passphrase?.message}
      >
        <input
          type="password"
          {...register("passphrase", { required: "Required" })}
        />
      </FormGroup>
      <button type="submit">Submit</button>
    </form>
  );
};
