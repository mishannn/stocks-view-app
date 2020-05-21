import React from "react";
import { PropsWithChildren } from "react";
import Button, { ButtonProps } from "antd/lib/button";
import "./BottomButton.css";

export default function BottomButtonComponent(
  props: PropsWithChildren<ButtonProps>
) {
  return (
    <Button className="bottom-button" {...props}>
      {props.children}
    </Button>
  );
}
