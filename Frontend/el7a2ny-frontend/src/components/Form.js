import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { MAX_LEN } from "src/project-utils/constants";
import { fixFormDate } from "src/project-utils/helper-functions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
  TextField,
  Box,
} from "@mui/material";
import TextInput from "./Inputs/TextInput";
import MenuInput from "./Inputs/MenuInput";

function Form({ title, fields, onSubmit, actionName, values, largeTitle }) {
  const [touched, setTouched] = useState(fields.map((item) => false));

  const initialValues = values
    ? values
    : fields.reduce((acc, item) => {
        acc[item.name] = "";
        return acc;
      }, {});

  // console.log("values", initialValues, values);

  const validationSchema = Yup.object(
    fields.reduce((acc, item) => {
      if (item.type === "date") {
        acc[item.name] = Yup.date().required(`${item.label} is required`);
      } else if (item.type === "text" || item.type === "menu") {
        acc[item.name] = Yup.string().max(MAX_LEN).required(`${item.label} is required`);
      }
      return acc;
    }, {})
  );

  const form = useFormik({ initialValues, validationSchema, onSubmit });

  function handleChange(item, value, index) {
    item.setValue(value);
    form.setFieldValue(item.name, item.type == "date" ? fixFormDate(value) : value);
    setTouched((prev) =>
      prev.map((element, prevIndex) => {
        if (prevIndex == index) {
          return element | (value != "");
        }
        return element;
      })
    );
  }
  const formInputs = fields.map((item, index) => {
    const element =
      item.type === "menu" ? (
        <MenuInput
          menuName={item.label}
          options={item.options}
          setValue={(value) => {
            handleChange(item, value, index);
          }}
        />
      ) : (
        <TextInput
          option={item.label}
          defaultValue={initialValues[item.name]}
          setValue={(value) => {
            handleChange(item, value, index);
          }}
          type={item.type}
          disabled={item.disabled}
        />
      );

    return (
      <Grid key={item.name} xs={12} md={6}>
        {element}
        <TextField
          error={!!(touched[index] ? form.errors[item.name] : null)}
          helperText={touched[index] ? form.errors[item.name] : null}
          fullWidth
          name={item.name}
          onBlur={form.handleBlur}
          value={form.values[item.name]}
          onChange={form.handleChange}
          variant="standard"
          InputProps={{
            sx: { display: "none" },
          }}
        />
      </Grid>
    );
  });

  return (
    <form noValidate onSubmit={form.handleSubmit}>
      <Card>
        {title && (
          <CardHeader title={title} titleTypographyProps={{ variant: largeTitle ? "h4" : null }} />
        )}
        <CardContent>
          <Box>
            <Grid container spacing={3}>
              {formInputs}
            </Grid>
          </Box>
        </CardContent>
        {actionName ? (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                console.log(form.isValid);
                if (!form.isValid) {
                  setTouched(fields.map((item) => true));
                }
              }}
            >
              {actionName}
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </form>
  );
}
export default Form;
