import React, { PropsWithChildren } from "react";
import { PageHeader } from "antd";
import "./MainLayout.css";

export interface MainLayoutProps {
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  onBack?: () => void;
}

export default function MainLayoutComponent(
  props: PropsWithChildren<MainLayoutProps>
) {
  const titleSkeleton = <div className="title-skeleton" />;

  return (
    <div className="main-layout">
      <PageHeader
        className="header"
        onBack={props.onBack}
        title={props.title || titleSkeleton}
        subTitle={props.subtitle}
        extra={props.extra}
      />
      <div className="body">{props.children}</div>
    </div>
  );
}
