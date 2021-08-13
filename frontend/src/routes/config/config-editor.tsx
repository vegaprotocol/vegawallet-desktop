import React from "react";
import { Config } from "../../models/config";
import { SaveConfig } from "../../api/service";
import { ErrorMessage } from "../../components/error-message";
import { SuccessMessage } from "../../components/success-message";
import { FormGroup } from "../../components/form-group";

export interface ConfigDetailsProps {
  config: Config;
}

export const ConfigEditor = (props: ConfigDetailsProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [config, setConfig] = React.useState<string>(
    JSON.stringify(props.config, null, 4)
  );

  const handleConfig = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>
    setConfig(e.target.value);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    SaveConfig(config)
      .then((success) => {
        if (success) {
          setErrorMessage(null);
          setSuccessMessage("Configuration saved!");
        }
      })
      .catch((error) => {
        setSuccessMessage(null);
        setErrorMessage(`Error: ${error}`);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="Configuration" labelFor="config">
        <textarea
          id="config"
          name="config"
          value={config}
          onChange={handleConfig}
        />
      </FormGroup>
      <button type="submit">Submit</button>
      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />
    </form>
  );
};
