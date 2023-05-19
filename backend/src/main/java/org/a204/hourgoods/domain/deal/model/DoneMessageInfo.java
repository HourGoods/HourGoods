package org.a204.hourgoods.domain.deal.model;

import org.a204.hourgoods.domain.deal.response.DoneMessageResponse;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DoneMessageInfo {
	@Schema(name = "판매자 닉네임")
	private String sellerNickname;

	@Schema(name = "구매자 닉네임")
	private String purchaserNickname;

	@Schema(name = "판매자 닉네임")
	private DoneMessageResponse doneMessageResponse;
}
