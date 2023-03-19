import { FormikProvider, useFormik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { number, object } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { sizes_dict } from "../../constants/sizes_dict";

let sizes: any = [
  {
    sectionTitle: "Longueur (cm)",
    fields: [
      { id: "common_length"},
      { id: "max_length"},
    ],
  },
  {
    sectionTitle: "Diamètre (cm)",
    fields: [
      { id: "common_diameter" },
      { id: "max_diameter" },
    ],
  },
  {
    sectionTitle: "Taille de la colonie (cm)",
    fields: [
      { id: "common_colony_size" },
      { id: "max_colony_size"},
    ],
  },
  {
    sectionTitle: "Diamètre du polype (cm)",
    fields: [
      { id: "common_polyp_diameter"},
      { id: "max_polyp_diameter" },
    ],
  },
];

// Add field titles to sizes variable (regarding sizes_dict)
for (const section of sizes) {
  for (const field of section.fields) {
    field.title = sizes_dict[field.id].fr;
  }
}

const SizesForm = forwardRef(
  (props: { species: ISpecies; submitCallback: any }, ref) => {
    const initialValues = sizes.reduce(
      (acc: any, section: any) =>
        section.fields.reduce((acc: any, field: any) => {
          // console.log(field);
          return {
            ...acc,
            [field.id]: (props.species.sizes as any)[field.id] || null,
          };
        }, acc),
      {}
    );

    const validationSchema = sizes.reduce(
      (acc: any, section: any) =>
        section.fields.reduce((acc: any, field: any) => {
          // console.log(field);
          return {
            ...acc,
            [field.id]: number()
              .min(2, "Name must be at least 2 characters")
              .nullable()
              .typeError("Doit être un nombre"),
          };
        }, acc),
      {}
    );

    const formik = useFormik<any>({
      initialValues: {
        ...initialValues,
      },
      validationSchema: object().shape(validationSchema),
      onSubmit: async (data) => {
        // Check errors
        if (Object.keys(formik.errors).length > 0) {
          return;
        }

        console.log("data", data);

        let sizes: any = {};
        for (const sizeProperty in data) {
          if (data[sizeProperty]) {
            sizes[sizeProperty] = data[sizeProperty];
          }
        }

        let newData = {
          sizes: sizes,
        };

        await saveNewSpeciesVersion(props.species.id, newData);

        // display success toast
        toast.success("Nom sauvegardé", {
          toastId: "successPublication",
        });

        props.submitCallback();
      },
    });

    const isFormFieldValid = (name: string) =>
      !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name: string) => {
      return (
        isFormFieldValid(name) && (
          <small className="p-error text-sm block">
            <ul className="list-disc ml-3">
              <li key={name}>{(formik.errors as any)[name]}</li>
            </ul>
          </small>
        )
      );
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        console.log("Submit triggered");
        formik.handleSubmit();
      },
    }));

    return (
      <Style>
        <FormikProvider value={formik}>
          {sizes.map((size: any) => (
            <div key={size.sectionTitle} className="mb-4">
              <h3 className="text-lg font-medium">{size.sectionTitle}</h3>
              {size.fields.map((field: any) => (
                <div key={field.id} className="col-12 md-6">
                  <label htmlFor={field.id}>{field.title}</label>
                  <InputNumber
                    id={field.id}
                    name={field.id}
                    onChange={(values) => {
                      formik.setFieldValue(field.id, values.value);
                    }}
                    value={formik.values[field.id]}
                    className={`mt-2 ${
                      isFormFieldValid(field.id) ? "p-invalid" : undefined
                    }`}
                  />
                  {getFormErrorMessage(field.id)}
                </div>
              ))}
            </div>
          ))}
        </FormikProvider>
      </Style>
    );
  }
);

const Style = styled.div``;

SizesForm.displayName = "SizesForm";
export default SizesForm;
