import { getFxRates } from '@repo/lib/shared/utils/currencies'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const fxRates = await getFxRates()
    return NextResponse.json(fxRates)
  } catch (error) {
    console.error('Error fetching FX rates:', error)
    return NextResponse.json(null, { status: 500 })
  }
}