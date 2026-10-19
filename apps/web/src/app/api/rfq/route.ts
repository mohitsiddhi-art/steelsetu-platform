import { NextResponse } from 'next/server';
import { addRfq, getAllRfqs, StoredRFQ } from '@/lib/rfqStore';
import { INITIAL_STEEL_CATALOG } from '@/services/catalogService';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: getAllRfqs(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerName, companyName, gstNumber, tons, productId, pincode } = body;

    if (!buyerName || !companyName || !gstNumber || !tons || !productId || !pincode) {
      return NextResponse.json(
        { error: 'Missing mandatory fields' },
        { status: 400 }
      );
    }

    if (gstNumber.length !== 15) {
      return NextResponse.json(
        { error: 'GSTIN must be exactly 15 characters' },
        { status: 400 }
      );
    }

    const matchedProduct = INITIAL_STEEL_CATALOG.find((p) => p.id === productId);
    const inquiryReference = `RFQ-${Date.now().toString(36).toUpperCase()}`;

    const newInquiry: StoredRFQ = {
      referenceId: inquiryReference,
      buyerName,
      companyName,
      gstNumber: gstNumber.toUpperCase(),
      tons: Number(tons),
      productId,
      productName: matchedProduct ? matchedProduct.name : 'Custom Coil/Sheet',
      pincode,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };

    addRfq(newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Inquiry registered into trade desk pipeline',
      data: newInquiry,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
