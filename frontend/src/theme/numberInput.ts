import { numberInputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(numberInputAnatomy.keys)

export const numberInputTheme = defineMultiStyleConfig({ 
    baseStyle: {
        field: {
           
        },
        addon: {
            color: "blue"
        }
    },
    defaultProps: {
        size: "lg",
    }

 })