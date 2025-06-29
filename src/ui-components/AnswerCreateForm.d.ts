/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type AnswerCreateFormInputValues = {
    Text?: string;
    Author?: string;
    createdAt?: string;
    parentID?: string;
};
export declare type AnswerCreateFormValidationValues = {
    Text?: ValidationFunction<string>;
    Author?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    parentID?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AnswerCreateFormOverridesProps = {
    AnswerCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Text?: PrimitiveOverrideProps<TextAreaFieldProps>;
    Author?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    parentID?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AnswerCreateFormProps = React.PropsWithChildren<{
    overrides?: AnswerCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AnswerCreateFormInputValues) => AnswerCreateFormInputValues;
    onSuccess?: (fields: AnswerCreateFormInputValues) => void;
    onError?: (fields: AnswerCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AnswerCreateFormInputValues) => AnswerCreateFormInputValues;
    onValidate?: AnswerCreateFormValidationValues;
} & React.CSSProperties>;
export default function AnswerCreateForm(props: AnswerCreateFormProps): React.ReactElement;
