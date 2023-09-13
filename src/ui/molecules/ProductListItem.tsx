import { type ProductItemType } from "../types";
import { ActiveLink } from "../atoms/ActiveLink";
import { ProductItem } from "../atoms/ProductItem";

export const ProductListItem = ({
	product: { name, coverImage, price, productId, category },
}: {
	product: ProductItemType;
}) => {
	return (
		<li className="cursor-pointer">
			<ActiveLink href={`/product/${productId}`}>
				<ProductItem name={name} coverImage={coverImage} price={price} category={category} />
			</ActiveLink>
		</li>
	);
};
