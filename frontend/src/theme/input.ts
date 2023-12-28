import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

export const inputTheme = defineMultiStyleConfig({ 
    baseStyle: {
        field: {
           
        },
        addon: {
            color: "blue",
            _dark: {
                color: "white"
            }
        }
    },
    defaultProps: {
        size: "lg",
    }
 })