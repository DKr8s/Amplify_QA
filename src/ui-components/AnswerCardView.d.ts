/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Answer } from "../models";
import { FlexProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
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
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AnswerCardViewOverridesProps = {
    AnswerCardView?: PrimitiveOverrideProps<ViewProps>;
    Headline?: PrimitiveOverrideProps<FlexProps>;
    "New Amplify Studio gives designers the ability to export UI to React code. New Amplify Studio gives designers the ability to export UI to React code. New Amplify Studio gives designers the ability to export UI to React code"?: PrimitiveOverrideProps<TextProps>;
    Frame?: PrimitiveOverrideProps<FlexProps>;
    authorName?: PrimitiveOverrideProps<TextProps>;
    createdAtDate?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type AnswerCardViewProps = React.PropsWithChildren<Partial<ViewProps> & {
    answer?: Answer;
} & {
    overrides?: AnswerCardViewOverridesProps | undefined | null;
}>;
export default function AnswerCardView(props: AnswerCardViewProps): React.ReactElement;
