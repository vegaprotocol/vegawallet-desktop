import React from "react";
import { useForm } from "react-hook-form";
import { LoadWallets } from "../../api/service";
import { FormGroup } from "../../components/form-group";
import { AppToaster } from "../../components/toaster";
import { Colors } from "../../config/colors";

interface FormFields {
  rootPath: string;
}

export function ImportPath() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit = async (values: FormFields) => {
    try {
      const success = await LoadWallets({
        RootPath: values.rootPath,
      });
      if (success) {
        AppToaster.show({
          message: "Wallet loaded!",
          color: Colors.GREEN,
        });
      } else {
        AppToaster.show({ message: "Error: Unknown", color: Colors.RED });
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label="* Path to wallet"
          labelFor="rootPath"
          errorText={errors.rootPath?.message}
        >
          <input
            id="rootPath"
            type="text"
            {...register("rootPath", { required: "Required" })}
          />
        </FormGroup>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
