import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerName, companyName, gstNumber, tons, productId, pincode } = body;

    // Server-side validation
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

    const inquiryReference = RFQ-;

    // Payload ready for database persistence / CRM webhook
    const recordedInquiry = {
      referenceId: inquiryReference,
      buyerName,
      companyName,
      gstNumber,
      tons: Number(tons),
      productId,
      pincode,
      status: 'LOGGED',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Inquiry logged successfully',
      data: recordedInquiry,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
