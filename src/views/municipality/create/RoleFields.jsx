import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const RoleFields = ({
  role,
  control,
  errors,
  isLoading,
  options,
  selectedOptions,
  setValue,
}) => {
  // if (role && (!options || options.length === 0)) {
  //     return <Typography variant='body1'>در حال دریافت داده ها...</Typography>;
  // }

  switch (role) {
    case "14":
      return (
        <FormControl fullWidth className="mbe-5">
          <Controller
            name="geo_region"
            control={control}
            rules={{ required: true }}
            defaultValue={selectedOptions ? [selectedOptions] : []}
            render={({ field: { value, onChange } }) =>
              isLoading ? (
                <Typography variant="body1">در حال بارگذاری...</Typography>
              ) : (
                <Autocomplete
                  options={options}
                  getOptionLabel={(option) =>
                    `${option.city.approved_name}-${option.approved_name}`
                  }
                  onChange={(event, newValue) => {
                    // اگر هیچ مقداری انتخاب نشده باشد
                    if (!newValue) {
                      setValue("geo_state", "");
                      setValue("geo_city", "");
                      setValue("geo_region", []);
                      onChange([]);
                      return;
                    }

                    setValue("geo_state", newValue.city.geo_state);
                    setValue("geo_city", newValue.geo_cities);
                    setValue("geo_region", [newValue.hierarchy_code]);
                    onChange([newValue.hierarchy_code]);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="بخش"
                      error={Boolean(errors.geo_region)}
                      helperText={errors.geo_region?.message}
                    />
                  )}
                  value={
                    options.find(
                      (option) => value && value[0] === option.hierarchy_code
                    ) || null
                  }
                />
              )
            }
          />
        </FormControl>
      );
    case "13":
      return (
        <FormControl fullWidth className="mbe-5">
          <Controller
            name="covered_villages"
            control={control}
            rules={{ required: true }}
            defaultValue={
              selectedOptions && Array.isArray(selectedOptions)
                ? options.filter((option) =>
                    selectedOptions.some(
                      (selected) =>
                        selected.village_code === option.hierarchy_code ||
                        selected === option.hierarchy_code
                    )
                  )
                : selectedOptions?.village_code
                  ? options.filter(
                      (option) =>
                        option.hierarchy_code === selectedOptions.village_code
                    )
                  : options.filter(
                      (option) => option.hierarchy_code === selectedOptions
                    ) || []
            }
            render={({ field: { value, onChange } }) =>
              isLoading ? (
                <Typography variant="body1">در حال بارگذاری...</Typography>
              ) : (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={options}
                  getOptionLabel={(option) =>
                    `${option.city_name}-${option.approved_name}`
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.hierarchy_code}>
                      <div>
                        <Typography variant="body1" fontWeight="bold">
                          {option.city_name} - {option.approved_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.geo_state} - {option.geo_region}
                        </Typography>
                      </div>
                    </li>
                  )}
                  onChange={(event, newValue) => {
                    if (newValue && newValue[0]) {
                      setValue("geo_state", newValue[0].geo_state);
                      setValue("geo_city", newValue[0].geo_city);

                      // جمع‌آوری geo_region‌های منحصر به فرد
                      const uniqueGeoRegions = [
                        ...new Set(newValue.map((item) => item.geo_region)),
                      ].map(String);
                      setValue("geo_region", uniqueGeoRegions);

                      const villages = newValue.map(
                        (item) => item.hierarchy_code
                      );
                      setValue("covered_villages", villages);
                      onChange(villages);
                    } else {
                      setValue("geo_state", "");
                      setValue("geo_region", []);
                      setValue("geo_city", "");
                      setValue("covered_villages", []);
                      onChange([]);
                    }
                  }}
                  defaultValue={
                    selectedOptions && Array.isArray(selectedOptions)
                      ? options.filter((option) =>
                          selectedOptions.some(
                            (selected) =>
                              selected.village_code === option.hierarchy_code ||
                              selected === option.hierarchy_code
                          )
                        )
                      : selectedOptions?.village_code
                        ? options.filter(
                            (option) =>
                              option.hierarchy_code ===
                              selectedOptions.village_code
                          )
                        : options.filter(
                            (option) =>
                              option.hierarchy_code === selectedOptions
                          ) || []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="روستا های تحت پوشش"
                      value={value}
                      onChange={onChange}
                      error={!!errors.personalField1}
                      helperText={
                        errors.personalField1
                          ? "انتخاب روستا های تحت پوشش الزامی است"
                          : ""
                      }
                    />
                  )}
                />
              )
            }
          />
        </FormControl>
      );
    case "16":
      return (
        <FormControl fullWidth className="mbe-5">
          <Controller
            name="geo_state"
            control={control}
            rules={{ required: true }}
            defaultValue={
              (selectedOptions &&
                options.find(
                  (option) => selectedOptions === option.hierarchy_code
                )) ||
              null
            }
            render={({ field: { value, onChange } }) =>
              isLoading ? (
                <Typography variant="body1">در حال بارگذاری...</Typography>
              ) : (
                <Autocomplete
                  disableCloseOnSelect
                  options={options}
                  getOptionLabel={(option) => `${option.approved_name}`}
                  onChange={(event, newValue) => {
                    setValue(
                      "geo_state",
                      newValue ? newValue.hierarchy_code : null
                    );
                    onChange(newValue ? newValue.hierarchy_code : null);
                  }}
                  defaultValue={
                    (selectedOptions &&
                      options.find(
                        (option) => selectedOptions === option.hierarchy_code
                      )) ||
                    null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="استان مربوطه"
                      value={value}
                      onChange={onChange}
                      error={!!errors.personalField1}
                      helperText={
                        errors.personalField1
                          ? "انتخاب استان مربوطه الزامی است"
                          : ""
                      }
                    />
                  )}
                />
              )
            }
          />
        </FormControl>
      );
    // Add other cases for different roles
    default:
      return null;
  }
};

export default RoleFields;
