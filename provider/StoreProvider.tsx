'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import {  AppStore, store } from '@/lib/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
 // @ts-ignore
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {

    storeRef.current = store()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}