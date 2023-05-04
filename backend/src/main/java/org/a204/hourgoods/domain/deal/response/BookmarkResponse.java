package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "북마크 등록 여부 반환")
public class BookmarkResponse {
	@Schema(description = "북마크 등록 여부")
	private Boolean isSuccess;
}
