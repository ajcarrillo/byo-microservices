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
          name: 'Mother Master',
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
          address: '429ee51e714d5e0a9f9dcb148b52bd2ca259e27b',
          name: 'Mother Slave',
          desc: 'A mother cube module',
          category: 'body',
          type: '0x01',
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
          address: '6b13267373518e3df057b4dd875fdb1543346140',
          name: 'Edge Cube',
          desc: 'An edge cube module',
          category: 'body',
          type: '0x03',
          faces: {
            top: 'male',
            bottom: 'none',
            left: 'none',
            right: 'male',
            front: 'female',
            back: 'female',
          },
        },
        {
          address: 'b8239ac1ef92f595a718096bc9db474ef46a15e0',
          name: 'Right Analog Cube',
          desc: 'A right analog cube module',
          category: 'body',
          type: '0x05',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'female',
            right: 'female',
            front: 'control',
            back: 'female',
          },
        },
        {
          address: 'f595a7180bef9296bc98239ac1db474ef46a15e0',
          name: 'Left Analog Cube',
          desc: 'A left analog cube module',
          category: 'body',
          type: '0x06',
          faces: {
            top: 'male',
            bottom: 'female',
            left: 'female',
            right: 'female',
            front: 'control',
            back: 'female',
          },
        },
        {
          address: '0f374b4fff2c335658903af07f5ea02458726a0f',
          name: 'Spacer',
          desc: 'A spacer module',
          category: 'body',
          type: '0x02',
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
          address: 'f38bbbf91352e33c69a6a3ed45cb06242cb1b11b',
          name: 'Charger',
          desc: 'A charging module',
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
          address: 'ffa0af62c38903f3507f5ea0587265f74b4f3024',
          name: 'DPad',
          desc: 'A DPad module',
          category: 'buttons',
          type: '0x07',
          faces: {
            top: 'male',
            bottom: 'control',
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
          type: '0x08',
          faces: {
            top: 'male',
            bottom: 'control',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: 'ffa0c38903584b4f35af74f60f3027265207f5ea',
          name: 'Two Buttons',
          desc: 'An two button module',
          category: 'buttons',
          type: '0x09',
          faces: {
            top: 'male',
            bottom: 'control',
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
          type: '0x10',
          faces: {
            top: 'male',
            bottom: 'control',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: '890f2c33f3fa50730287265f5ef4a0af60574b4f',
          name: 'Right Trigger',
          desc: 'A right trigger module',
          category: 'buttons',
          type: '0x11',
          faces: {
            top: 'male',
            bottom: 'control',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: '8507302872633f3fa590f2cf5e574b4ff4a0af60',
          name: 'Left Trigger',
          desc: 'A left trigger module',
          category: 'buttons',
          type: '0x12',
          faces: {
            top: 'male',
            bottom: 'control',
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
          type: '0x13',
          faces: {
            top: 'male',
            bottom: 'control',
            left: 'none',
            right: 'none',
            front: 'none',
            back: 'none',
          },
        },
        {
          address: '0903a726a0f7458f2c335658eb4fff07f5f3024a',
          name: 'Joystick',
          desc: 'An joystick module',
          category: 'buttons',
          type: '0x14',
          faces: {
            top: 'male',
            bottom: 'control',
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
