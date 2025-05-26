"use client";

import type { Data } from "@measured/puck";
import { Puck } from "@measured/puck";
import {config} from "@/puck.config";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  config.components && Object.keys(config.components).forEach(key => {
    const component = config.components[key];
    component.fields && Object.keys(component.fields).forEach(fieldKey => {
      const field = component.fields && component.fields[fieldKey];
      field && console.log(`Field type: ${field.type}`);
    });
  });

  return (
    <Puck
      config={config}
      data={data}
      onPublish={async (data) => {
        await fetch("/admin/page-builder/puck/api", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
