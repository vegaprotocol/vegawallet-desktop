import "./bullet-header.scss";
import React from "react";

interface BulletHeaderProps {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
}

export const BulletHeader = ({ tag, children }: BulletHeaderProps) => {
  return React.createElement(tag, { className: "bullet-header" }, children);
};
