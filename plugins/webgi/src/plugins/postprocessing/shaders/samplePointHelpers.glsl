#define PI 3.141592653589793

// invalid -  https://github.com/repalash/Open-Shaders/blob/f226a633874528ca1e7c3120512fc4a3bef3d1a6/Engines/Unreal/Private/MonteCarlo.ush#L12  //[ Duff et al. 2017, "Building an Orthonormal Basis, Revisited" ]

mat3 GetTangentBasis( vec3 TangentZ )
{
    vec3 up = vec3(0.0, 0.0, 1.0);
    vec3 TangentX = normalize(cross(dot(TangentZ, up) < 0.8 ? up : vec3(1.0, 0.0, 0.0), TangentZ));
    vec3 TangentY = cross(TangentZ, TangentX);
    return mat3( TangentX, TangentY, TangentZ );
}

vec4 CosineSampleHemisphere( vec2 E )
{
    float Phi = 2. * PI * E.x;
    float CosTheta = sqrt( E.y );
    float SinTheta = sqrt( 1. - CosTheta * CosTheta );

    vec3 H;
    H.x = SinTheta * cos( Phi );
    H.y = SinTheta * sin( Phi );
    H.z = CosTheta;

    float PDF = CosTheta * (1.0 /  PI);

    return vec4( H, PDF );
}


vec4 UniformSampleHemisphere( vec2 E )
{
    float Phi = 2. * PI * E.x;
    float CosTheta = E.y;
    float SinTheta = sqrt( 1. - CosTheta * CosTheta );

    vec3 H;
    H.x = SinTheta * cos( Phi );
    H.y = SinTheta * sin( Phi );
    H.z = CosTheta;

    float PDF = 1.0 / (2. * PI);

    return vec4( H, PDF );
}


vec2 UniformSampleDiskConcentric( vec2 E )
{
    vec2 p = 2. * E - 1.;
    float Radius;
    float Phi;
    if( abs( p.x ) > abs( p.y ) )
    {
        Radius = p.x;
        Phi = (PI/4.) * (p.y / p.x);
    }
    else
    {
        Radius = p.y;
        Phi = (PI/2.) - (PI/4.) * (p.x / p.y);
    }
    return vec2( Radius * cos( Phi ), Radius * sin( Phi ) );
}

// based on the approximate equal area transform from
// http://marc-b-reynolds.github.io/math/2017/01/08/SquareDisc.html
vec2 UniformSampleDiskConcentricApprox( vec2 E )
{
    vec2 sf = E * sqrt(2.0) - sqrt(0.5);// map 0..1 to -sqrt(0.5)..sqrt(0.5)
    vec2 sq = sf*sf;
    float root = sqrt(2.0*max(sq.x, sq.y) - min(sq.x, sq.y));
    if (sq.x > sq.y)
    {
        sf.x = sf.x > 0. ? root : -root;
    }
    else
    {
        sf.y = sf.y > 0. ? root : -root;
    }
    return sf;
}
