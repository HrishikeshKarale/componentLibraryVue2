import Vue, { PluginFunction, VueConstructor } from 'vue';


interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}

declare const Component_library_vue2: { install: InstallFunction };
export default Component_library_vue2;

export const Component_library_vue2Sample: VueConstructor<Vue>;
