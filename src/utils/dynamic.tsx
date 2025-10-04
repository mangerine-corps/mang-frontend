import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = (component: () => Promise<any>) => dynamic(component, { ssr: false });

export default DynamicComponentWithNoSSR