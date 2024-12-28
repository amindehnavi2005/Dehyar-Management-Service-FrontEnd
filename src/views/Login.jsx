"use client";

// React Imports
import { useContext, useState, useEffect } from "react";

// Next Imports
import Link from "next/link";
import { useRouter } from "next/navigation";

// MUI Imports
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, minLength, string } from "valibot";
import { AuthContext } from "@/contexts/AuthContext";

// Component Imports
import Logo from "@components/layout/shared/Logo";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Util Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { validateIranianNationalId } from "@/utils/nidCheck";
import accessControl from "@components/layout/vertical/accessControl";
import { LoadingButton } from "@mui/lab";
import DividerSimple from "@/components/common/Divider/DividerSimple";

const persianToEnglishDigits = (str) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  return str.replace(
    /[۰-۹]/g,
    (char) => englishDigits[persianDigits.indexOf(char)]
  );
};

const schema = object({
  email: string([
    minLength(1, "این فیلد الزامی است"),
    (input) => {
      if (!validateIranianNationalId(input)) {
        return { error: "کد ملی نامعتبر است" };
      }
      return { success: true };
    },
  ]),
  password: string([
    minLength(1, "این فیلد الزامی است"),
    minLength(5, "رمز عبور باید حداقل دارای ۵ کاراکتر باشد"),
  ]),
});

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [loading, setLoading] = useState(false);

  // Vars
  const darkImg = "/images/pages/auth-v2-mask-1-dark.png";
  const lightImg = "/images/pages/auth-v2-mask-1-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.png";
  const borderedDarkIllustration =
    "/images/illustrations/auth/v2-login-dark-border.png";
  const borderedLightIllustration =
    "/images/illustrations/auth/v2-login-light-border.png";

  // Hooks
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authBackground = useImageVariant(mode, lightImg, darkImg);

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  );

  const handleClickShowPassword = () => {
    setIsPasswordShown((show) => !show);

    const passwordField = document.getElementById("login-password");
    const currentCursorPosition = passwordField.selectionStart;

    setTimeout(() => {
      passwordField.focus();
      passwordField.setSelectionRange(
        currentCursorPosition,
        currentCursorPosition
      );
    }, 0);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await auth.login(data, () => {
        const workGroup = auth.user?.work_group;
        const allowedPages = accessControl[workGroup];
        if (allowedPages && allowedPages.length > 0) {
          const firstPage = allowedPages[0].href;
          router.push(firstPage);
        } else {
          router.push("/403");
        }
      });
    } catch (error) {
      setErrorState({ message: ["خطا در ورود. لطفاً دوباره تلاش کنید."] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) {
      const workGroup = auth.user.work_group;
      const allowedPages = accessControl[workGroup];
      if (allowedPages && allowedPages.length > 0) {
        const firstPage = allowedPages[0].href;
        router.push(firstPage);
      } else {
        router.push("/403");
      }
    }
  }, [auth.user, router]);

  return (
    <div className="flex justify-between h-full">
      <div className="flex flex-1 h-full justify-center items-start bg-backgroundPaper !min-is-full px-6 md:!min-is-[unset] md:px-12 py-2 md:is-[480px]">
        <div className="flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset]">
          <div>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              {/* <Logo component /> */}
              <img
                className="w-[40%] mb-2"
                src={
                  theme.palette.mode === "light"
                    ? "images/logos/logo.svg"
                    : "images/logos/logo_white.svg"
                }
                alt="لوگو سایت"
              />
              <Typography variant="h5">
                {" "}
                <span>پنجره واحد خدمات الکترونیک</span>
              </Typography>
            </Box>
          </div>
          <form
            noValidate
            method="post"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  autoFocus
                  type="text"
                  label="نام کاربری"
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" }, // مرکزچین کردن متن داخل فیلد ورودی
                    },
                  }}
                  onChange={(e) => {
                    const value = persianToEnglishDigits(e.target.value);
                    field.onChange(value);
                    errorState !== null && setErrorState(null);
                  }}
                  {...((errors.email || errorState !== null) && {
                    error: true,
                    helperText:
                      errors?.email?.message || errorState?.message[0],
                  })}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  style={{ textAlign: "center" }}
                  label="رمز عبور"
                  id="login-password"
                  type={isPasswordShown ? "text" : "password"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    errorState !== null && setErrorState(null);
                  }}
                  InputProps={{
                    inputProps: {
                      style: { textAlign: "center" }, // مرکزچین کردن متن داخل فیلد ورودی
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                          aria-label="toggle password visibility"
                        >
                          <i
                            className={
                              isPasswordShown
                                ? "ri-eye-off-line"
                                : "ri-eye-line"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...(errors.password && {
                    error: true,
                    helperText: errors.password.message,
                  })}
                />
              )}
            />
            <div className="flex justify-between items-center flex-wrap gap-x-3 gap-y-1">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="به خاطر سپردن"
              />
              <Typography
                className="text-end"
                color="primary"
                component={Link}
                href="/forgot-password"
              >
                فراموشی رمز عبور
              </Typography>
            </div>
            <LoadingButton
              fullWidth
              variant="contained"
              type="submit"
              loading={loading}
              loadingIndicator={
                <span className="text-backgroundPaper">در حال پردازش...</span>
              }
            >
              ورود
            </LoadingButton>
            <DividerSimple title={"سایر روش های احراز هویت"} />
            <div className="flex gap-5 justify-center">
              <Button variant="contained" color="info">
                درگاه وزارت کشور
              </Button>
              <Button variant="contained" color="info">
                درگاه دولت هوشمند
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="md:flex md:flex-col md:gap-5 md:px-32 lg:flex-[2] hidden justify-center items-center md:w-1/2">
        <Typography
          className="mt-auto"
          variant="h4"
          alignItems={"center"}
          textAlign={"center"}
        >
          پنجره واحد خدمات الکترونیکی شهرداری ها و دهیاری ها
        </Typography>
        <Typography
          mt={2}
          textAlign={"justify"}
          width={"85%"}
          className="leading-[1.5] w-full lg:leading-[3]"
        >
          از آنجا که مسئولیت حسن اجرای ضوابط تعیین شده در متن قانونی مرتبط با
          شهرداری ها و دهیاری ها بر عهده وزارت کشور بوده که این موضوع از طریق
          سازمان شهرداری ها و دهیاری ها کشور انجام میگردد. لذا در راستای تسریع و
          تهسیل در فرایند نظارتی و پایش عملکرد شهرداری ها و دهیاری ها سامانه
          مذکور طراحی گردیده است.
        </Typography>
        <img
          className="mt-auto"
          src="images/cards/smartCity.svg"
          alt="بنر شهرستان ها"
        />
      </div>
    </div>
  );
};

export default Login;
