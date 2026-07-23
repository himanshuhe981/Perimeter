"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Form, Input, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem";
import Paragraph from "antd/es/typography/Paragraph";
import { graphqlFetch } from "@/lib/graphqlFetch";

type Perimeter = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
} | null;

const SET_PERIMETER_MUTATION = /* GraphQL */ `
  mutation SetPerimeter(
    $label: String!
    $latitude: Float!
    $longitude: Float!
    $radiusMeters: Int!
  ) {
    setPerimeter(
      label: $label
      latitude: $latitude
      longitude: $longitude
      radiusMeters: $radiusMeters
    ) {
      id
    }
  }
`;

type FormValues = {
  label: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
};

export function PerimeterForm({
  currentPerimeter,
}: {
  currentPerimeter: Perimeter;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await graphqlFetch(SET_PERIMETER_MUTATION, {
        label: values.label,
        latitude: values.latitude,
        longitude: values.longitude,
        radiusMeters: Math.round(values.radiusKm * 1000),
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Location perimeter" className="pm-card" style={{ border: "none" }}>
      <Paragraph type="secondary" style={{ marginTop: -8 }}>
        {currentPerimeter
          ? `Staff can only clock in within ${(currentPerimeter.radiusMeters / 1000).toFixed(1)}km of "${currentPerimeter.label}."`
          : "Set the area your care team must be inside to clock in."}
      </Paragraph>
      <Form<FormValues>
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          label: currentPerimeter?.label,
          latitude: currentPerimeter?.latitude,
          longitude: currentPerimeter?.longitude,
          radiusKm: currentPerimeter
            ? currentPerimeter.radiusMeters / 1000
            : undefined,
        }}
      >
        <FormItem name="label" label="Label" rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem
          name="radiusKm"
          label="Radius (km)"
          rules={[{ required: true }]}
        >
          <InputNumber min={0.1} step={0.1} style={{ width: "100%" }} />
        </FormItem>
        <FormItem name="latitude" label="Latitude" rules={[{ required: true }]}>
          <InputNumber step={0.0001} style={{ width: "100%" }} />
        </FormItem>
        <FormItem
          name="longitude"
          label="Longitude"
          rules={[{ required: true }]}
        >
          <InputNumber step={0.0001} style={{ width: "100%" }} />
        </FormItem>
        {error && (
          <Alert
            type="error"
            showIcon
            title={error}
            style={{ marginBottom: 16 }}
          />
        )}
        <FormItem style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {currentPerimeter ? "Update perimeter" : "Set perimeter"}
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
}
