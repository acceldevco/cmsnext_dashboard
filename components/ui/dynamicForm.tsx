"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import UploadFile from '../UploadFile';

// Helper to generate initial form state based on dynamic fields
const generateInitialFormState = (fields: FieldDefinition[]) => {
  const initialState: { [key: string]: any } = {};
  fields.forEach(field => {
    // Skip non-input fields like id, createdAt, updatedAt
    if (['id', 'createdAt', 'updatedAt'].includes(field.name)) return;

    if (field.input === 'checkbox') {
      initialState[field.name] = field.defaultValue ?? false;
    } else {
      initialState[field.name] = field.defaultValue ?? "";
    }
  });
  return initialState;
};

export interface FieldDefinition {
  name: string;
  label: string;
  type: string; // e.g., 'varchar', 'text', 'datetime(3)', 'tinyint(1)'
  input: 'input' | 'textarea' | 'checkbox' | 'select' | 'images';
  inputType?: string; // e.g., 'text', 'datetime-local', 'number'
  required?: boolean;
  options?: { value: string; label: string }[]; // For select inputs
  defaultValue?: any;
  className?: string; // Optional additional class names for the field container
  span?: number; // Optional col-span for grid layout (e.g., 1, 2, 3)
}

interface DynamicFormProps {
  fields: any;
  initialData?: { [key: string]: any }; // Data for editing
  onSubmit: (formData: { [key: string]: any }) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean; // Loading state controlled by parent
  error?: string | null; // Error message controlled by parent
  formTitle?: string;
  className?: string; // Optional class for the form element
  gridCols?: number; // Number of columns for the grid layout (default 1)
}

export function DynamicForm({
  fields,
  initialData,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  isLoading = false,
  error = null,
  formTitle,
  className = "mb-6 bg-gray-50 p-4 rounded-lg border",
  gridCols = 3 // Default to 3 columns
}: DynamicFormProps) {
  const [form, setForm] = useState<{ [key: string]: any }>({});

  // Initialize form state when fields or initialData change
  useEffect(() => {
    const baseInitialState = generateInitialFormState(fields);


    if (initialData) {
      const editFormState: { [key: string]: any } = { ...baseInitialState };
      fields.forEach((field: FieldDefinition) => {
        if (initialData.hasOwnProperty(field.name)) {
          if (field.inputType === 'datetime-local' && initialData[field.name]) {
            try {
              const date = new Date(initialData[field.name]);
              if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                editFormState[field.name] = `${year}-${month}-${day}T${hours}:${minutes}`;
              } else {
                editFormState[field.name] = ""; // Set to empty if date is invalid
              }
            } catch (error) {
              console.error("Error formatting date:", error);
              editFormState[field.name] = ""; // Fallback
            }
          } else {
            editFormState[field.name] = initialData[field.name] ?? baseInitialState[field.name];
          }
        }
      });
      setForm(editFormState);
    } else {
      setForm(baseInitialState);
    }
  }, [fields, initialData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(e.target);
    
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prevForm => ({ ...prevForm, [name]: checked }));
    } else if (type === 'file') {
      console.log(form);

      const { files } = (e.target as HTMLInputElement);
      if (files && files.length > 0) {
        const formData = new FormData();

        const file = files[0];
        formData.append('images', file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm(prevForm => ({ ...prevForm, [name]: { data: reader.result, name: file.name } }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    }
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((name: string, checked: boolean | 'indeterminate') => {
    // Ensure checked is boolean
    setForm(prevForm => ({ ...prevForm, [name]: !!checked }));
  }, []);

  const internalHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { ...form };

    // Pre-process data before submitting (e.g., date formatting)
    fields.forEach(field => {
      if (field.inputType === 'datetime-local' && formData[field.name]) {
        try {
          const localDateTimeString = formData[field.name];
          const dateTimeStringWithSeconds = localDateTimeString.length === 16 ? `${localDateTimeString}:00` : localDateTimeString;
          const date = new Date(dateTimeStringWithSeconds);
          if (!isNaN(date.getTime())) {
            formData[field.name] = date.toISOString();
          } else {
            console.warn("Invalid date value provided for", field.name, ":", localDateTimeString);
            formData[field.name] = null;
          }
        } catch (error) {
          console.error("Error processing date for", field.name, ":", error);
          formData[field.name] = null;
        }
      } else if (field.inputType === 'datetime-local' && (formData[field.name] === "" || formData[field.name] === null || formData[field.name] === undefined)) {
        formData[field.name] = null;
      }
    });

    await onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default cancel behavior: reset form to initial state based on fields
      setForm(generateInitialFormState(fields));
    }
  };

  return (

    <form onSubmit={internalHandleSubmit} className={className}>
      {formTitle && <h3 className="text-xl font-semibold mb-4">{formTitle}</h3>}
      <div className={

        // `grid grid-cols-1 md:grid-cols-${gridCols} gap-4 mb-4`
        `flex flex-col`
      }>
        {fields.map((field) => {
          if (['id', 'createdAt', 'updatedAt'].includes(field.name)) return null;

          const colSpanClass = field.span ? `md:col-span-${field.span}` : (field.input === 'textarea' ? `md:col-span-${gridCols}` : '');
          const fieldContainerClass = `${colSpanClass} ${field.className || ''}`.trim();

          if (field.input === 'input' || field.input === 'textarea') {
            const Component = field.input === 'textarea' ? Textarea : Input;
            return (
              <div key={field.name} className={fieldContainerClass}>
                <Label htmlFor={field.name}>{field.label}{field.required ? ' *' : ''}</Label>
                {
                  field.inputType != 'file' && <Component
                    id={field.name}
                    name={field.name}
                    value={field.inputType != 'file' ? form[field.name] : ''} // Ensure value is controlled
                    onChange={handleChange}
                    placeholder={field.label}
                    required={field.required}
                    rows={field.input === 'textarea' ? 4 : undefined}
                    type={field.inputType || 'text'}
                    className="mt-1"
                    disabled={isLoading}
                  />
                }

                {
                  field.inputType === 'file' && <UploadFile name={field.name} handleChange={handleChange}/>
                }

              </div>
            );
          } else if (field.input === 'checkbox') {
            return (
              <div key={field.name} className={`flex items-center space-x-2 mt-4 md:mt-0 md:pt-7 ${fieldContainerClass}`}> {/* Adjust alignment */}
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={!!form[field.name]} // Ensure value is boolean
                  onCheckedChange={(checked) => handleCheckboxChange(field.name, checked)} // Use onCheckedChange
                  disabled={isLoading}
                />
                <Label htmlFor={field.name}>{field.label}</Label>
              </div>
            );
          } else if (field.input === 'select') {
            return (
              <div key={field.name} className={fieldContainerClass}>
                <Label htmlFor={field.name}>{field.label}{field.required ? ' *' : ''}</Label>
                <Select
                  name={field.name}
                  value={form[field.name] ?? ''}
                  onValueChange={(value) => handleSelectChange(field.name, value)}
                  required={field.required}
                  disabled={isLoading}
                >
                  <SelectTrigger id={field.name} className="mt-1">
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options || []).map((option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          return null;
        })}
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isLoading}>
          {submitButtonText}
        </Button>
        {onCancel && <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>{cancelButtonText}</Button>}
      </div>
    </form>
  );
}
