import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { executeGraphql } from "./getProductsList";
import {
	type CartFragment,
	CartGetByIdDocument,
	CartCreateDocument,
	ProductGetByIdDocument,
	CartAddProductDocument,
} from "@/gql/graphql";

export async function getOrCreateCart(): Promise<CartFragment> {
	const cart = await getCart();
	if (cart) {
		return cart;
	}
	const { createOrder: newCart } = await createCart();

	if (!newCart) {
		throw new Error("Cart not created");
	}
	cookies().set("cartId", newCart.id);
	return newCart;
}

export async function getCart() {
	const cartId = cookies().get("cartId")?.value;
	if (cartId) {
		const cart = await executeGraphql({
			query: CartGetByIdDocument,
			variables: { id: cartId },
			next: {
				tags: ["cart"],
			},
			cache: "no-store",
		});
		if (!cart.order) {
			return;
		}
		return cart.order;
	}
}
export function createCart() {
	return executeGraphql({ query: CartCreateDocument });
}

export async function addProductToCart(orderId: string, productId: string) {
	const { product } = await executeGraphql({
		query: ProductGetByIdDocument,
		variables: { id: productId },
	});

	if (!product) {
		throw new Error(`Product with id ${productId} not found`);
	}
	await executeGraphql({
		query: CartAddProductDocument,
		variables: {
			orderId,
			productId,
			total: product.price,
		},
	});

	revalidateTag("cart");
}