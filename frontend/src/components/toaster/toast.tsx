import "./toast.scss";
import React from "react";

export const Toast = ({
  id,
  message,
  onDismiss,
  color = "purple",
}: {
  id: string;
  message: string;
  onDismiss: (key: string) => void;
  color?: string;
}) => {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onDismiss(id);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [id, onDismiss]);

  return (
    <div
      className="toast"
      role="alert"
      style={{
        padding: "10px 20px",
        background: color,
        color: "white",
        minWidth: 200,
        marginTop: 20,
        borderRadius: 2,
      }}
    >
      {message}
    </div>
  );
};
