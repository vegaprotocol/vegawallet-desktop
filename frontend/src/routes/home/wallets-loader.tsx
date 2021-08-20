import React from "react";
import {LoadWallets} from "../../api/service";
import {FormGroup} from "../../components/form-group";
import {useForm} from "react-hook-form";
import {AppToaster} from "../../components/toaster";
import {Colors} from "../../config/colors";
import {LoadWalletsRequest} from "../../models/load-wallets";

interface FormFields {
    rootPath: string;
}

export interface WalletsLoaderProps {
    request: LoadWalletsRequest;
}

export const WalletsLoader = ({request}: WalletsLoaderProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormFields>({
        defaultValues: {
            rootPath: request.RootPath,
        },
    });

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
                    {...register("rootPath", {required: "Required"})}
                />
            </FormGroup>
            <button type="submit">Submit</button>
        </form>
    );
};
