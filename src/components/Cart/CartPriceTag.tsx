import {
  HStack,
  StackProps,
  Text,
  TextProps,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";

interface PriceTagProps {
  price: number;
  salePrice?: number;
  rootProps?: StackProps;
  priceProps?: TextProps;
  salePriceProps?: TextProps;
}

export type FormatPriceOptions = { locale?: string; currency?: string };

export function formatPrice(value: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

export const PriceTag = (props: PriceTagProps) => {
  const { price, salePrice, rootProps, priceProps, salePriceProps } = props;
  return (
    <HStack spacing="1" {...rootProps}>
      <Price isOnSale={!!salePrice} textProps={priceProps}>
        {formatPrice(price)}
      </Price>
      {salePrice && (
        <SalePrice {...salePriceProps}>{formatPrice(salePrice)}</SalePrice>
      )}
    </HStack>
  );
};

interface PriceProps {
  children?: React.ReactNode;
  isOnSale?: boolean;
  textProps?: TextProps;
}

const Price = (props: PriceProps) => {
  const { isOnSale, children, textProps } = props;
  const defaultColor = mode("gray.700", "gray.400");
  const onSaleColor = mode("gray.400", "gray.700");
  const color = isOnSale ? onSaleColor : defaultColor;
  return (
    <Text
      as="span"
      fontWeight="medium"
      color={color}
      textDecoration={isOnSale ? "line-through" : "none"}
      {...textProps}
    >
      {children}
    </Text>
  );
};

const SalePrice = (props: TextProps) => (
  <Text
    as="span"
    fontWeight="semibold"
    color={mode("gray.800", "gray.100")}
    {...props}
  />
);
