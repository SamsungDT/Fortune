package dt.fortune_user.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QJwtEntity is a Querydsl query type for JwtEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QJwtEntity extends EntityPathBase<JwtEntity> {

    private static final long serialVersionUID = 653621287L;

    public static final QJwtEntity jwtEntity = new QJwtEntity("jwtEntity");

    public final StringPath accessToken = createString("accessToken");

    public final DateTimePath<java.time.LocalDateTime> accessTokenExpiredAt = createDateTime("accessTokenExpiredAt", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final ComparablePath<java.util.UUID> id = createComparable("id", java.util.UUID.class);

    public final StringPath refreshToken = createString("refreshToken");

    public final DateTimePath<java.time.LocalDateTime> refreshTokenExpiredAt = createDateTime("refreshTokenExpiredAt", java.time.LocalDateTime.class);

    public QJwtEntity(String variable) {
        super(JwtEntity.class, forVariable(variable));
    }

    public QJwtEntity(Path<? extends JwtEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QJwtEntity(PathMetadata metadata) {
        super(JwtEntity.class, metadata);
    }

}

