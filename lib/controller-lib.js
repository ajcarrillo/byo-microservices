/**
 * Returns an array of available controller modules
 * @return {Promise}
 */
const getControllerModules = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const modules = [
        {
          address: '429ee51e71f9dcb144d59e27b5e0a98b52bd2ca2',
          name: 'Mother Cube',
          desc: 'A mother cube module',
          category: 'body',
          type: '0x00',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'female',
            right: 'female',
            front: 'female',
            back: 'female',
          },
        },
        {
          address: 'f595a7180bef9296bc98239ac1db474ef46a15e0',
          name: 'Analog Cube',
          desc: 'A analog cube module',
          category: 'body',
          type: '0x01',
          faces: {
            top: 'control',
            bottom: 'female',
            left: 'female',
            right: 'male',
            front: 'female',
            back: 'female',
          },
        },
        {
          address: '6b13267373518e3df057b4dd875fdb1543346140',
          name: 'Edge Cube',
          desc: 'An edge cube module',
          category: 'body',
          type: '0x02',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'female',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'f38bbbf91352e33c69a6a3ed45cb06242cb1b11b',
          name: 'Charger',
          desc: 'A charging module',
          category: 'body',
          type: '0x03',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: '0f374b4fff2c335658903af07f5ea02458726a0f',
          name: 'Spacer',
          desc: 'A spacer module',
          category: 'body',
          type: '0x04',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: '0f374b4fff2c33502458726a0f658903af07f5ea',
          name: 'XBox Buttons',
          desc: 'An XBox button module',
          category: 'buttons',
          type: '0x05',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'ff2c33502458726a0f658903af07f5ea0f374b4f',
          name: 'Four Buttons',
          desc: 'An four button module',
          category: 'buttons',
          type: '0x06',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'ffa0af74b4f3507f5ea0f3024f62c38903587265',
          name: 'Two Buttons',
          desc: 'An two button module',
          category: 'buttons',
          type: '0x07',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'ffa0af74b4f3507f5ea0f3024f62c38903587265',
          name: 'One Button',
          desc: 'An one button module',
          category: 'buttons',
          type: '0x08',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'ffa0af62c38903f3507f5ea0587265f74b4f3024',
          name: 'DPad',
          desc: 'A DPad module',
          category: 'buttons',
          type: '0x09',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'f2c38903f3fa507f5ef74b4f302872654a0af605',
          name: 'Trigger',
          desc: 'A trigger module',
          category: 'buttons',
          type: '0x10',
          faces: {
            top: 'control',
            bottom: 'male',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
      ]
      resolve(modules)
    } catch (e) {
      logger.error(`auth-lib: Failed to get controller module list: ${e}`)
      reject(e)
    }
  })
}

export {
  getControllerModules,
}
