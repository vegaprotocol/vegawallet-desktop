import "./wallet-creator.scss";
import React from "react";
import { CreateWallet } from "../../api/service";
import { FormGroup } from "../../components/form-group";
import { useForm } from "react-hook-form";
import { AppToaster } from "../../components/toaster";
import { Colors } from "../../config/colors";
import {
  CreateWalletRequest,
  CreateWalletResponse,
} from "../../models/create-wallet";
import { Link } from "react-router-dom";

interface FormFields {
  rootPath: string;
  name: string;
  passphrase: string;
  mnemonic: string;
}

export interface WalletCreatorProps {
  request: CreateWalletRequest;
}

export const WalletCreator = ({ request }: WalletCreatorProps) => {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      rootPath: request.RootPath,
      name: request.Name,
      passphrase: request.Passphrase,
    },
  });

  const onSubmit = async (values: FormFields) => {
    try {
      const resp = await CreateWallet({
        RootPath: values.rootPath,
        Name: values.name,
        Passphrase: values.passphrase,
      });
      if (resp) {
        setResponse(resp);
        AppToaster.show({
          message: "Wallet created!",
          color: Colors.GREEN,
        });
      } else {
        AppToaster.show({ message: "Error: Unknown", color: Colors.RED });
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED });
    }
  };

  return response ? (
    <>
      <p>
        Here is your mnemonic phrase. Please take note of the words below as you
        will need these to restore your wallet!
      </p>
      <pre className="wallet-creator__mnemonic">{response.Mnemonic}</pre>
      <Link to="/">
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label="* Name"
        labelFor="name"
        errorText={errors.name?.message}
      >
        <input type="text" {...register("name", { required: "Required" })} />
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
      <FormGroup>
        <button
          type="button"
          onClick={() => setAdvancedOpen((x) => !x)}
          className="link"
        >
          {advancedOpen ? "Hide advanced options" : "Show advanced options"}
        </button>
      </FormGroup>
      {advancedOpen && (
        <FormGroup
          label="Location (defaults to home directory)"
          labelFor="rootPath"
          errorText={errors.rootPath?.message}
        >
          <input type="text" {...register("rootPath")} />
        </FormGroup>
      )}
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
