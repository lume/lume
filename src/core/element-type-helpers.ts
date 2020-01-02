/* eslint-disable typescript/explicit-function-return-type */
export const div = (e: JSX.Element) => (e as any) as HTMLDivElement
export const h1 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const h2 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const h3 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const h4 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const h5 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const h6 = (e: JSX.Element) => (e as any) as HTMLHeadingElement
export const section = (e: JSX.Element) => (e as any) as HTMLElement
export const svg = (e: JSX.Element) => (e as any) as SVGSVGElement

export function elm<T>(e: JSX.Element) {
  return (e as any) as T
}
