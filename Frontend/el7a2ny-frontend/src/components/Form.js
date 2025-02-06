import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { MAX_LEN } from "src/project-utils/Constants";
import { fixFormDate } from "src/project-utils/HelperFunctions";
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
import DateInput from "./Inputs/DateInput";
import MenuInput from "./Inputs/MenuInput";

function Form({ title, fields, onSubmit, actionName, values}) {
  const [touched, setTouched] = useState(fields.map((item) => false));
  
  const initialValues = values ? values : fields.reduce((acc, item) => {
    acc[item.name] = "";
    return acc;
  }, {});

  console.log("values", initialValues)

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
      item.type === "date" ? (
        <DateInput
          option={item.label}
          defaultValue={initialValues[item.name]}
          setValue={(value) => {
            handleChange(item, value, index);
          }}
        />
      ) : item.type === "menu" ? (
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
          type={initialValues[item.name]}
          setValue={(value) => {
            handleChange(item, value, index);
            console.log("form", form);
          }}
        />
      );

    return (
      <Grid key={item.name} xs={12} md={6}>
        {element}
        <TextField
          error={!!(touched[index] && form.errors[item.name])}
          helperText={touched[index] && form.errors[item.name]}
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
        <CardHeader title={title} />
        <CardContent>
          <Box>
            <Grid container spacing={3}>
              {formInputs}
            </Grid>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              console.log(form.isValid)
              if (!form.isValid) {
                setTouched(fields.map((item) => true));
              }
            }}
          >
            {actionName}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
export default Form;
