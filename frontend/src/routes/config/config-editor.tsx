import React from "react";
import { Config } from "../../models/config";
import { SaveConfig } from "../../api/service";
import { ErrorMessage } from "../../components/error-message";
import { SuccessMessage } from "../../components/success-message";
import { FormGroup } from "../../components/form-group";
import { useForm } from "react-hook-form";
import { LogLevels } from "../../config/log-levels";
import { AppToaster, Toaster } from "../../components/toaster";
import { Toast } from "../../components/toaster/toast";
import { Colors } from "../../config/colors";

interface FormFields {
  logLevel: string;
  tokenExpiry: string;
  port: number;
  host: string;
  nodeRetries: number;
  consoleUrl: string;
  consolePort: number;
}

export interface ConfigEditorProps {
  config: Config;
}

export const ConfigEditor = ({ config }: ConfigEditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      logLevel: config.Level,
      tokenExpiry: config.TokenExpiry,
      port: config.Port,
      host: config.Host,
      nodeRetries: config.Nodes.Retries,
      consoleUrl: config.Console.URL,
      consolePort: config.Console.LocalPort,
    },
  });

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const onSubmit = async (values: FormFields) => {
    try {
      const configJSON = JSON.stringify({
        Level: values.logLevel,
        TokenExpiry: values.tokenExpiry,
        Port: Number(values.port),
        Host: values.host,
        Console: {
          URL: values.consoleUrl,
          LocalPort: Number(values.consolePort),
        },
        Nodes: {
          Hosts: config.Nodes.Hosts,
          Retries: Number(values.nodeRetries),
        },
      });
      const success = await SaveConfig(configJSON);
      if (success) {
        AppToaster.show({
          message: "Configuration saved!",
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label="Log level"
        labelFor="logLevel"
        errorText={errors.logLevel?.message}
      >
        <select {...register("logLevel", { required: "Required" })}>
          {Object.values(LogLevels).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </FormGroup>
      <FormGroup
        label="Token expiry"
        labelFor="tokenExpiry"
        errorText={errors.tokenExpiry?.message}
      >
        <input
          type="text"
          {...register("tokenExpiry", { required: "Required" })}
        />
      </FormGroup>
      <FormGroup label="Port" labelFor="port" errorText={errors.port?.message}>
        <input type="text" {...register("port", { required: "Required" })} />
      </FormGroup>
      <FormGroup label="Host" labelFor="host" errorText={errors.host?.message}>
        <input type="text" {...register("host", { required: "Required" })} />
      </FormGroup>
      <FormGroup
        label="Node retries"
        labelFor="nodeRetries"
        errorText={errors.nodeRetries?.message}
      >
        <input
          type="text"
          {...register("nodeRetries", { required: "Required" })}
        />
      </FormGroup>
      <FormGroup
        label="Console URL"
        labelFor="consoleUrl"
        errorText={errors.consoleUrl?.message}
      >
        <input
          type="text"
          {...register("consoleUrl", { required: "Required" })}
        />
      </FormGroup>
      <FormGroup
        label="Console port"
        labelFor="consolePort"
        errorText={errors.consolePort?.message}
      >
        <input
          type="text"
          {...register("consolePort", { required: "Required" })}
        />
      </FormGroup>
      <button type="submit">Submit</button>
      {/* <button
        onClick={() => AppToaster.show({ message: "foo", color: "blue" })}
      >
        Go blue
      </button>
      <button
        onClick={() => AppToaster.show({ message: "foo", color: "green" })}
      >
        Go green
      </button> */}
    </form>
  );
};
