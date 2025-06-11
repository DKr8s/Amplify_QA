/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Answer } from "../models";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AnswerUpdateFormInputValues = {
    Text?: string;
    Author?: string;
};
export declare type AnswerUpdateFormValidationValues = {
    Text?: ValidationFunction<string>;
    Author?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AnswerUpdateFormOverridesProps = {
    AnswerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Text?: PrimitiveOverrideProps<TextAreaFieldProps>;
    Author?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AnswerUpdateFormProps = React.PropsWithChildren<{
    overrides?: AnswerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    answer?: Answer;
    onSubmit?: (fields: AnswerUpdateFormInputValues) => AnswerUpdateFormInputValues;
    onSuccess?: (fields: AnswerUpdateFormInputValues) => void;
    onError?: (fields: AnswerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AnswerUpdateFormInputValues) => AnswerUpdateFormInputValues;
    onValidate?: AnswerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AnswerUpdateForm(props: AnswerUpdateFormProps): React.ReactElement;
