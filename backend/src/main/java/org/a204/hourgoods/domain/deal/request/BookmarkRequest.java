package org.a204.hourgoods.domain.deal.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "북마크 생성 / 삭제 요청")
public class BookmarkRequest {
	@Schema(description = "북마크를 원하는 거래ID")
	private Long dealId;
}
