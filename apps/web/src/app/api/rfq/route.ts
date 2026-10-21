import { NextResponse } from 'next/server';
import { addRfq, getAllRfqs } from '@/services/rfqService';
import { getProductById } from '@/services/catalogService';
import { getStaffIdentity } from '@/services/authService';

/**
 * The inquiry feed.
 *
 * Reads the same buyer details the trade desk ledger shows, so it is
 * staff-only. The proxy already rejects anonymous callers with a 401; this
 * check is the second lock on the same door, and it fails closed.
 */
export async function GET() {
  const staff = await getStaffIdentity();

  if (!staff) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const inquiries = await getAllRfqs();
  return NextResponse.json({ success: true, data: inquiries });
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

    const gst = String(gstNumber).trim().toUpperCase();
    if (gst.length !== 15) {
      return NextResponse.json(
        { error: 'GSTIN must be exactly 15 characters' },
        { status: 400 }
      );
    }

    const quantity = Number(tons);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number of metric tons' },
        { status: 400 }
      );
    }

    // Resolve the product against the live catalogue so the trade desk shows a
    // real name and we can reject inquiries for products that don't exist.
    const product = await getProductById(String(productId));
    if (!product) {
      return NextResponse.json(
        { error: 'Unknown product reference' },
        { status: 404 }
      );
    }

    if (quantity < product.minimumOrderTons) {
      return NextResponse.json(
        { error: `Minimum order quantity for this SKU is ${product.minimumOrderTons} MT` },
        { status: 400 }
      );
    }

    if (quantity > product.inventoryTons) {
      return NextResponse.json(
        { error: `Only ${product.inventoryTons} MT available in spot stock` },
        { status: 400 }
      );
    }

    const inquiryReference = `RFQ-${Date.now().toString(36).toUpperCase()}`;

    const stored = await addRfq({
      referenceId: inquiryReference,
      buyerName: String(buyerName).trim(),
      companyName: String(companyName).trim(),
      gstNumber: gst,
      tons: quantity,
      productId: product.id,
      productName: product.name,
      pincode: String(pincode).trim(),
      status: 'PENDING',
    });

    if (!stored) {
      return NextResponse.json(
        { error: 'Could not register the inquiry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry registered into trade desk pipeline',
      data: stored,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
